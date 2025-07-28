import { Link } from 'react-router';
import type { Route } from './+types/index';
import type { Project } from '~/types';
import ProjectCard from '~/components/ProjectCard';

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[] }> {
  const res = await fetch('http://localhost:5000/projects');
  const data = await res.json();
  return { projects: data };
}

const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {
  const { projects } = loaderData as { projects: Project[] };

  return (
    <>
      <h2 className="text-3xl text-white font-bold mb-8">Projects</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <Link
            className="block transform transition duration-300 hover:scale-[1.02]"
            to={`/projects/${project.id}`}
          >
            <ProjectCard key={project.id} project={project} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default ProjectsPage;
