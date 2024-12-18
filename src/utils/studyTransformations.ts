type Phase = {
  name: string;
  status: "completed" | "in-progress" | "pending";
  progress: number;
}

type RawPhase = {
  name: string;
  status: string;
  progress: number;
  order: number;
}

type Meeting = {
  id: string;
  title: string;
  date: string;
  status: string;
}

export const transformStudyPhases = (phases: RawPhase[] = []): Phase[] => {
  return phases
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(phase => ({
      name: phase.name,
      status: phase.status === 'completed' ? 'completed' as const : 
             phase.status === 'in_progress' ? 'in-progress' as const : 
             'pending' as const,
      progress: phase.progress || 0
    }))
}

export const calculateOverallProgress = (phases: Phase[]): number => {
  return phases.length > 0
    ? Math.round(phases.reduce((acc, phase) => acc + phase.progress, 0) / phases.length)
    : 0
}

export const getUpcomingMilestones = (meetings: Meeting[] = [], endDate?: string) => {
  const upcomingMeetings = meetings
    .filter(meeting => 
      meeting.status === 'confirmed' && 
      new Date(meeting.date) > new Date()
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return [
    ...upcomingMeetings.map(meeting => ({
      date: new Date(meeting.date).toLocaleDateString('fr-FR'),
      title: meeting.title,
      description: "Rendez-vous confirmé",
    })),
    {
      date: endDate ? new Date(endDate).toLocaleDateString('fr-FR') : 'Non définie',
      title: "Fin prévue de l'étude",
      description: "Date de livraison finale",
    }
  ]
}

export const getCurrentPhase = (phases: Phase[]): string => {
  return phases.find(p => p.status === 'in-progress')?.name || 'En attente'
}