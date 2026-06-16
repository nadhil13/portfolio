import React from 'react';

const Skills = () => {
  const skillsList = ['React', 'Javascript', 'Node.js', 'Tailwind'];

  return (
    <div className="flex flex-row flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4 justify-center lg:justify-start w-full">
      {skillsList.map((skill) => (
        <div
          key={skill}
          className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base text-white transition-all duration-300 ease-in-out border rounded-full cursor-pointer border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20"
        >
          {skill}
        </div>
      ))}
    </div>
  );
};

export default Skills;
