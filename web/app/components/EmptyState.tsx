interface EmptyStateProps { title: string; description: string; icon?: string; }
export default function EmptyState({ title, description, icon = "📭" }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
