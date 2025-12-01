"use client";
import { useStoryblokState } from "@storyblok/react";
import { StoryblokStory } from "@storyblok/react/rsc";

interface HomeClientProps {
  story: any; 
}

export default function HomeClient({ story }: HomeClientProps) {
  const liveStory = useStoryblokState(story);
  return <StoryblokStory story={liveStory} />;
}


