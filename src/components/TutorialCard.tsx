import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Play } from "lucide-react";

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  zipUrl: string;
  thumbnail: string;
  duration: string;
}

interface TutorialCardProps {
  tutorial: Tutorial;
  onPlayVideo: (tutorial: Tutorial) => void;
}

export const TutorialCard = ({ tutorial, onPlayVideo }: TutorialCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-hover)] animate-fade-in">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={tutorial.thumbnail}
            alt={tutorial.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-full items-center justify-center">
              <Button
                size="lg"
                className="rounded-full bg-primary/90 backdrop-blur-sm hover:bg-primary"
                onClick={() => onPlayVideo(tutorial)}
              >
                <Play className="mr-2 h-5 w-5" />
                Assistir
              </Button>
            </div>
          </div>
          <Badge className="absolute right-3 top-3 bg-background/90 text-foreground backdrop-blur-sm">
            {tutorial.duration}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Badge variant="secondary" className="mb-3">
          {tutorial.category}
        </Badge>
        <h3 className="mb-2 text-xl font-semibold text-foreground">{tutorial.title}</h3>
        <p className="text-sm text-muted-foreground">{tutorial.description}</p>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 p-4">
        <Button
          variant="outline"
          className="w-full"
          asChild
        >
          <a href={tutorial.zipUrl} download>
            <Download className="mr-2 h-4 w-4" />
            Download Arquivos
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
