export function HelpContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <h2 className="text-lg font-semibold text-foreground">Getting started</h2>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
        <li>Create a workspace from the onboarding flow or dashboard.</li>
        <li>Add projects inside a workspace.</li>
        <li>Add tasks to projects and set status (To do, In progress, Done).</li>
      </ul>
      <h2 className="mt-6 text-lg font-semibold text-foreground">Workspaces</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Use the workspace switcher in the sidebar to switch context. All
        projects and tasks are scoped to a workspace.
      </p>
      <h2 className="mt-6 text-lg font-semibold text-foreground">Activity</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The Activity page shows a log of recent actions (create, update, delete)
        for your account.
      </p>
    </div>
  );
}
