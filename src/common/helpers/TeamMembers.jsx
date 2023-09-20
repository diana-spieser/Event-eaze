/* eslint-disable max-len */
import { FaGitlab } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';
import IMAGES from '../../assets/images/Images';

const JuniorJSDevelopers = [
  {
    name: 'Diana Spieser',
    imageSrc: IMAGES.diana,
    content:
      'I\'m Diana Spieser, a dedicated junior JavaScript developer with a passion for building interactive web applications using React. My strong foundation in JavaScript and React, along with my creativity and commitment, allows me to deliver exceptional solutions.',
    position: 'Junior Frontend Developer',
    accounts: [
      {
        url: 'https://gitlab.com/dianaspieser',
        label: 'GitLab Account',
        type: 'gray',
        icon: <FaGitlab />,
      },
      {
        url: 'https://www.linkedin.com/in/diana-spieser/',
        label: 'LinkedIn Account',
        type: 'gray',
        icon: <FaLinkedin />,
      },
    ],
  },
  {
    name: 'Dimo Dimov',
    imageSrc: IMAGES.dimo,
    content:
      'I\'m Dimo Dimov, a highly skilled junior JavaScript and React developer. My dedication to excellence and innovation allows me to excel in turning ideas into reality. My expertise in JavaScript and React makes me a valuable asset to any development team.',
    position: 'Junior Frontend Developer',
    accounts: [
      {
        url: 'https://gitlab.com/dimodimov',
        label: 'GitLab Account',
        type: 'gray',
        icon: <FaGitlab />,
      },
      {
        url: 'https://www.linkedin.com/in/dimo-dimov/',
        label: 'LinkedIn Account',
        type: 'gray',
        icon: <FaLinkedin />,
      },
    ],
  },
  {
    name: 'Georgi Naydenov',
    imageSrc: IMAGES.georgi,
    content:
      'I\'m Georgi Naydenov, a proficient junior JavaScript and React programmer. My dedication, expertise, and innovation-driven mindset enable me to thrive in solving complex problems and delivering fresh perspectives to every project.',
    position: 'Junior Frontend Developer',
    accounts: [
      {
        url: 'https://gitlab.com/Georgi_Naydenov',
        label: 'GitLab Account',
        type: 'gray',
        icon: <FaGitlab />,
      },
      {
        url: 'https://www.linkedin.com/in/georgi-naydenov-/',
        label: 'LinkedIn Account',
        type: 'gray',
        icon: <FaLinkedin />,
      },
    ],
  },
];

export default JuniorJSDevelopers;
