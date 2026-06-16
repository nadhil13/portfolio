import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  orderBy, 
  query, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_NAME = 'comments';

// Get all comments (real-time)
export const getComments = async () => {
  try {
    if (!db) {
      console.warn('Firebase DB not initialized, using localStorage fallback');
      const savedComments = localStorage.getItem('portfolioComments');
      return savedComments ? JSON.parse(savedComments) : [];
    }
    
    const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    // Fallback to localStorage if Firebase fails
    const savedComments = localStorage.getItem('portfolioComments');
    return savedComments ? JSON.parse(savedComments) : [];
  }
};

// Add new comment
export const addComment = async (commentData) => {
  try {
    const fallbackComment = {
      id: Date.now().toString(),
      ...commentData,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    if (!db) {
      console.warn('Firebase DB not initialized, using localStorage only');
      const savedComments = localStorage.getItem('portfolioComments');
      const comments = savedComments ? JSON.parse(savedComments) : [];
      const updatedComments = [fallbackComment, ...comments];
      localStorage.setItem('portfolioComments', JSON.stringify(updatedComments));
      return fallbackComment;
    }

    const newComment = {
      name: commentData.name,
      message: commentData.message,
      photo: commentData.photo,
      timestamp: serverTimestamp(),
      likes: 0
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newComment);
    
    // Return the comment with the new ID
    return {
      id: docRef.id,
      ...newComment,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    // Fallback to localStorage if Firebase fails
    const fallbackComment = {
      id: Date.now().toString(),
      ...commentData,
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    const savedComments = localStorage.getItem('portfolioComments');
    const comments = savedComments ? JSON.parse(savedComments) : [];
    const updatedComments = [fallbackComment, ...comments];
    localStorage.setItem('portfolioComments', JSON.stringify(updatedComments));
    
    return fallbackComment;
  }
};

// Update comment likes
export const updateCommentLikes = async (commentId, newLikes) => {
  try {
    if (!db) {
      console.warn('Firebase DB not initialized, using localStorage only');
      const savedComments = localStorage.getItem('portfolioComments');
      if (savedComments) {
        const comments = JSON.parse(savedComments);
        const updatedComments = comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: newLikes }
            : comment
        );
        localStorage.setItem('portfolioComments', JSON.stringify(updatedComments));
      }
      return true;
    }

    const commentRef = doc(db, COLLECTION_NAME, commentId);
    await updateDoc(commentRef, {
      likes: newLikes
    });
    return true;
  } catch (error) {
    console.error('Error updating likes:', error);
    // Fallback to localStorage if Firebase fails
    const savedComments = localStorage.getItem('portfolioComments');
    if (savedComments) {
      const comments = JSON.parse(savedComments);
      const updatedComments = comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: newLikes }
          : comment
      );
      localStorage.setItem('portfolioComments', JSON.stringify(updatedComments));
    }
    return false;
  }
};