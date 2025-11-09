import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tutorial } from "./TutorialCard";

interface VideoPlayerProps {
  tutorial: Tutorial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VideoPlayer = ({ tutorial, open, onOpenChange }: VideoPlayerProps) => {
  if (!tutorial) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{tutorial.title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          <video
            src={tutorial.videoUrl}
            controls
            className="h-full w-full"
            autoPlay
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
        <div className="mt-4">
          <p className="text-muted-foreground">{tutorial.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
