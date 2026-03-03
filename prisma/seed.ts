import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a seed user (Clerk ID for dev - replace with real after first sign-in)
  const user = await prisma.user.upsert({
    where: { clerkId: "seed-user-clerk-id" },
    create: {
      clerkId: "seed-user-clerk-id",
      email: "seed@taskflow.local",
      name: "Seed User",
      onboardingCompletedAt: new Date(),
    },
    update: {},
  });

  const workspace = await prisma.workspace.upsert({
    where: { slug: "acme" },
    create: {
      name: "Acme Inc",
      slug: "acme",
    },
    update: {},
  });

  await prisma.membership.upsert({
    where: {
      workspaceId_userId: { workspaceId: workspace.id, userId: user.id },
    },
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: "Owner",
    },
    update: {},
  });

  const project1 = await prisma.project.findFirst({
    where: { workspaceId: workspace.id, name: "Q1 Launch" },
  }) ?? await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: "Q1 Launch",
      description: "Launch goals for Q1",
    },
  });

  const project2 = await prisma.project.findFirst({
    where: { workspaceId: workspace.id, name: "Documentation" },
  }) ?? await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: "Documentation",
      description: "Product docs",
    },
  });

  const existingTasks = await prisma.task.count({
    where: { projectId: project1.id },
  });
  if (existingTasks === 0) {
    await prisma.task.createMany({
      data: [
        { projectId: project1.id, title: "Set up infrastructure", status: "Done" },
        { projectId: project1.id, title: "Design landing page", status: "InProgress" },
        { projectId: project1.id, title: "Launch beta", status: "Todo" },
        { projectId: project2.id, title: "API reference", status: "Todo" },
      ],
    });
  }

  const logCount = await prisma.activityLog.count({ where: { userId: user.id } });
  if (logCount === 0) {
    await prisma.activityLog.createMany({
      data: [
        { userId: user.id, workspaceId: workspace.id, action: "project.create", entityType: "Project", entityId: project1.id, metadata: JSON.stringify({ name: project1.name }) },
        { userId: user.id, workspaceId: workspace.id, action: "task.create", entityType: "Task", entityId: project1.id, metadata: JSON.stringify({ title: "Set up infrastructure" }) },
      ],
    });
  }

  console.log("Seed completed: user, workspace, projects, tasks, activity.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
