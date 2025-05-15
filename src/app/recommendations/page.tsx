import { AIRecommendationsForm } from '@/components/game/AIRecommendationsForm';

export default function RecommendationsPage() {
  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-primary">
          Discover Your Next Favorite Game
        </h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">
          Let our AI analyze your preferences and suggest games tailored just for you.
        </p>
      </div>
      <AIRecommendationsForm />
    </div>
  );
}
