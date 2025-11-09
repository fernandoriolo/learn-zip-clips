import { useState, useEffect } from "react";
import { Tutorial } from "@/components/TutorialCard";
import { supabase } from "@/integrations/supabase/client";

export const useTutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTutorials: Tutorial[] = data.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        category: t.category,
        duration: t.duration,
        videoUrl: t.video_url,
        zipUrl: t.zip_url,
        thumbnail: t.thumbnail_url || "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80"
      }));

      setTutorials(formattedTutorials);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTutorial = async (tutorial: Omit<Tutorial, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('tutorials')
        .insert([{
          title: tutorial.title,
          description: tutorial.description,
          category: tutorial.category,
          duration: tutorial.duration,
          video_url: tutorial.videoUrl,
          zip_url: tutorial.zipUrl,
          thumbnail_url: tutorial.thumbnail
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchTutorials();
    } catch (error) {
      console.error('Error adding tutorial:', error);
      throw error;
    }
  };

  const deleteTutorial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tutorials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchTutorials();
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      throw error;
    }
  };

  return {
    tutorials,
    addTutorial,
    deleteTutorial,
    loading,
    refetch: fetchTutorials
  };
};
