import { GoalBoard } from "@/components/goal-board";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex w-full flex-1">
        <GoalBoard />
      </main>
    </div>
  );
}
