import { Stack } from '@chakra-ui/react';
import AboutHero from '../../components/About/AboutHero';
import AboutTeamMemberCard from '../../components/About/AboutTeamMemberCard';
import teamMembers from '../../common/helpers/teamMembers';

function About() {
  return (
    <>
      <AboutHero />
      <Stack
        direction={ { base: 'column', md: 'row' } }
        spacing={ { base: 1, md: 1, lg: 2 } }
      >
        {teamMembers.map((member, index) => (
          <AboutTeamMemberCard key={ index } member={ member } />
        ))}
      </Stack>
    </>
  );
}

export default About;
