import React from 'react';
import styled from 'styled-components';

const CourseCardWrapper = styled.div`
  .card_box {
    width: 288px;
    height: 396px;
    border-radius: 12px;
    background: white;
    position: relative;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid #e5e7eb;
    overflow: hidden;
  }

  .card_box:hover {
    transform: scale(0.98);
    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  }

  .premium_span {
    position: absolute;
    overflow: hidden;
    width: 150px;
    height: 150px;
    top: -10px;
    left: -10px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .premium_span::before {
    content: 'Premium';
    position: absolute;
    width: 150%;
    height: 40px;
    background-image: linear-gradient(45deg, #ff6547 0%, #ffb144 51%, #ff7053 100%);
    transform: rotate(-45deg) translateY(-20px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    box-shadow: 0 5px 10px rgba(0,0,0,0.23);
    font-size: 14px;
  }

  .premium_span::after {
    content: '';
    position: absolute;
    width: 10px;
    bottom: 0;
    left: 0;
    height: 10px;
    z-index: -1;
    box-shadow: 140px -140px #cc3f47;
    background-image: linear-gradient(45deg, #FF512F 0%, #F09819 51%, #FF512F 100%);
  }
`;

const PlacementGuaranteeCourses: React.FC = () => {
  const courseImages = [
    'https://training-comp-uploads.internshala.com/homepage/media/specialization_section/card-images-desktop/full-stack-web-development-specialization-v2.png?v=v6',
    'https://training-comp-uploads.internshala.com/homepage/media/specialization_section/card-images-desktop/data-science-specialization-v3.png?v=v6',
    'https://training-comp-uploads.internshala.com/homepage/media/specialization_section/card-images-desktop/human-resource-management-specialization-v2.png?v=v6',
    'https://training-comp-uploads.internshala.com/homepage/media/specialization_section/card-images-desktop/digital-marketing-specialization-v2.png?v=v6'
  ];

  const courses = [
    {
      title: "Full Stack Development Course",
      tag: "course with guaranteed job",
      duration: "6 months course",
      salary: "Get placed with ₹3-10 LPA salary",
      opportunities: "1.0 Lac+ opportunities",
      image: courseImages[0],
      isPremium: true
    },
    {
      title: "Data Science Course",
      tag: "course with internship placement",
      duration: "6 months course",
      salary: "Get confirmed ₹40,000 total stipend",
      opportunities: "45,500+ opportunities",
      image: courseImages[1],
      isPremium: false
    },
    {
      title: "Human Resource Management Course",
      tag: "course with job placement",
      duration: "3 months course",
      salary: "Get placed with ₹3-10 LPA salary",
      opportunities: "2.9 Lac+ opportunities",
      image: courseImages[2],
      isPremium: true
    },
    {
      title: "Digital Marketing Course",
      tag: "course with guaranteed job",
      duration: "5 months course",
      salary: "Get placed with ₹3-10 LPA salary",
      opportunities: "8.25 Lac+ opportunities",
      image: courseImages[3],
      isPremium: false
    }
  ];

  return (
    <div className="max-w-full mx-auto p-4 font-sans overflow-hidden">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Placement guarantee courses</h1>
      
      <div className="flex space-x-8 overflow-x-auto pb-4 -mx-4 px-4">
        {courses.map((course, index) => (
          <CourseCardWrapper key={index}>
            <div 
              className="card_box"
              style={{ marginRight: '1.5rem' }}
            >
              {/* Premium ribbon */}
              {course.isPremium && (
                <div className="premium_span" />
              )}
              
              {/* Image container */}
              <div className="w-full h-44 bg-gray-100 overflow-hidden">
                {course.image && (
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {/* Content container */}
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">{course.title}</h2>
                <p className="text-xs text-blue-600 mb-1">{course.tag}</p>
                <p className="text-sm text-gray-600 mb-1">{course.duration}</p>
                <p className="text-sm text-gray-800 font-medium mb-1">{course.salary}</p>
                <p className="text-sm text-gray-600">{course.opportunities}</p>
              </div>
            </div>
          </CourseCardWrapper>
        ))}
      </div>
    </div>
  );
};

export default PlacementGuaranteeCourses;