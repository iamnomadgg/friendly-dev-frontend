import type { Route } from './+types/details';
import type { Project } from '~/types';

export async function clientLoader({
  request,
  params,
}: Route.ClientLoaderArgs): Promise<Project> {
  const res = await fetch(`http://localhost:5000/projects/${params.id}`);

  if (!res.ok) throw new Response('Project Not Found', { status: 404 });

  const project: Project = await res.json();
  return project;
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

const ProjectDetailsPage = ({ loaderData }: Route.ComponentProps) => {
  const project = loaderData;
  console.log(project);
  return <>ProjectDetails</>;
};

export default ProjectDetailsPage;
