import React from 'react';

export interface SessionTemplateProps {
  moduleId: number;
  sessionId: number;
}

export function SessionTemplate({ moduleId, sessionId }: SessionTemplateProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Module {moduleId} - Session {sessionId}
      </h1>
      <p>Session content will be loaded here.</p>
    </div>
  );
}
