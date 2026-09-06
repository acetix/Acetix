import { useState } from 'react';
import type { Project } from '../lib/types';
import { projectAccent } from '../lib/projects';

interface ProjectImageProps {
  project: Project;
  className?: string;
}

/**
 * Project screenshots come from direct image URLs (managed in Firestore,
 * never uploaded to Storage). If a link is missing or fails to load, a
 * gradient tile with the project's initial keeps the layout intact.
 */
export default function ProjectImage({ project, className = '' }: ProjectImageProps) {
  const [failed, setFailed] = useState(false);

  if (!project.imageUrl || failed) {
    return (
      <div
        role="img"
        aria-label={project.title}
        className={`flex items-center justify-center bg-gradient-to-br ${projectAccent(project)} ${className}`}
      >
        <span className="font-display text-6xl font-bold text-white/90">
          {project.title.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={project.imageUrl}
      alt={`${project.title} interface`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
