import {
  FaMusic,
  FaUsers,
  FaGraduationCap,
  FaLeaf,
  FaChild,
  FaPalette,
  FaUtensils,
  FaHeart,
  FaBicycle,
  FaQuestion,
  FaFlag,
  FaPrayingHands,
  FaGift,
  FaDumbbell,
  FaDesktop,
  FaPlane,

} from 'react-icons/fa';
import { BiSolidBusiness } from 'react-icons/bi';


export const getIconByCategory = (category) => {
  switch (category) {
    case 'Arts & Entertainment':
      return <FaMusic />;
    case 'Business & Networking':
      return <BiSolidBusiness />;
    case 'Community & Social':
      return <FaUsers />;
    case 'Education':
      return <FaGraduationCap />;
    case 'Environment & Sustainability':
      return <FaLeaf />;
    case 'Family & Kids':
      return <FaChild />;
    case 'Fashion & Beauty':
      return <FaPalette />;
    case 'Food & Drink':
      return <FaUtensils />;
    case 'Health & Wellness':
      return <FaHeart />;
    case 'Hobbies & Interests':
      return <FaBicycle />;
    case 'Miscellaneous':
      return <FaQuestion />;
    case 'Political & Activism':
      return <FaFlag />;
    case 'Religious & Spiritual':
      return <FaPrayingHands />;
    case 'Special Occasions':
      return <FaGift />;
    case 'Sports & Fitness':
      return <FaDumbbell />;
    case 'Technology':
      return <FaDesktop />;
    case 'Travel & Adventure':
      return <FaPlane />;
    default:
      return null;
  }
};


export const eventCategories = [
  'Arts & Entertainment',
  'Business & Networking',
  'Community & Social',
  'Education',
  'Environment & Sustainability',
  'Family & Kids',
  'Fashion & Beauty',
  'Food & Drink',
  'Health & Wellness',
  'Hobbies & Interests',
  'Miscellaneous',
  'Political & Activism',
  'Religious & Spiritual',
  'Special Occasions',
  'Sports & Fitness',
  'Technology',
  'Travel & Adventure',
];

export const calculateEventCountsByCategory = (events) => {
  const counts = {};

  events.forEach((event) => {
    const { categoryId } = event;
    if (categoryId in counts) {
      counts[categoryId]++;
    } else {
      counts[categoryId] = 1;
    }
  });

  return counts;
};

export const formatDateTime = (dateTimeString) => {
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };
  return new Date(dateTimeString).toLocaleString(undefined, options);
};
