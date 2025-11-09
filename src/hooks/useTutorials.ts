import { useState, useEffect } from "react";
import { Tutorial } from "@/components/TutorialCard";

const STORAGE_KEY = "tutorial-hub-data";

export const useTutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTutorials(JSON.parse(stored));
    }
  }, []);

  const saveTutorials = (newTutorials: Tutorial[]) => {
    setTutorials(newTutorials);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTutorials));
  };

  const addTutorial = (tutorial: Tutorial) => {
    const newTutorials = [...tutorials, tutorial];
    saveTutorials(newTutorials);
  };

  const deleteTutorial = (id: string) => {
    const newTutorials = tutorials.filter(t => t.id !== id);
    saveTutorials(newTutorials);
  };

  return {
    tutorials,
    addTutorial,
    deleteTutorial
  };
};
