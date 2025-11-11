import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ProtectedRoute } from "../src/components/ProtectedRoute";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LottieLoader } from "@/components/ui/LottieLoader";
import Link from "next/link";

interface Pose {
  id: number;
  english_name: string;
  sanskrit_name_adapted: string;
  sanskrit_name: string;
  translation_name: string;
  pose_description: string;
  pose_benefits: string;
  url_svg: string;
  url_png: string;
  url_svg_alt: string;
}

interface Category {
  id: number;
  category_name: string;
  category_description: string;
  poses: Pose[];
}

export default function Yoga() {
  return (
    <ProtectedRoute>
      <YogaContent />
    </ProtectedRoute>
  );
}

function YogaContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Pose | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/v1/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: Category[] = await res.json();
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0]);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  async function handlePoseClick(pose: Pose) {
    setModalData(pose);
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm z-50">
          <LottieLoader />
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Yoga</h1>
          <Link href="/meditation" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Go to Meditation
          </Link>
        </div>

        {error && <p className="text-destructive">Error: {error}</p>}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 space-y-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer ${
                  selectedCategory?.id === category.id ? "border-primary" : "border-border"
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  const posesElement = document.getElementById('poses');
                  if (posesElement) {
                    if (window.innerWidth >= 768) {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      posesElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              >
                <CardHeader>
                  <CardTitle>{category.category_name}</CardTitle>
                  <CardDescription>{category.category_description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div id="poses" className="md:w-2/3 space-y-6">
            {selectedCategory ? (
              <>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Poses in {selectedCategory.category_name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {selectedCategory.poses.map((pose) => (
                    <Card key={pose.id} className="border-border cursor-pointer" onClick={() => handlePoseClick(pose)}>
                      <CardHeader>
                        <CardTitle>{pose.english_name}</CardTitle>
                        <CardDescription>{pose.sanskrit_name_adapted}</CardDescription>
                      </CardHeader>
                      <CardContent className="h-45 flex flex-col justify-between">
                        <img
                          src={pose.url_png}
                          alt={pose.english_name}
                          className="w-full h-24 object-contain mb-2"
                        />
                        <p className="text-muted-foreground text-sm">
                          {pose.pose_benefits.length > 120
                            ? `${pose.pose_benefits.slice(0, 120)}... `
                            : pose.pose_benefits}
                          <button
                            className="text-primary underline text-xs ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePoseClick(pose);
                            }}
                            type="button"
                          >
                            view more
                          </button>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <p>Select a category to see poses</p>
            )}
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="w-[90vw] sm:w-auto max-w-2xl">
            <DialogHeader>
              <DialogTitle>{modalData?.english_name}</DialogTitle>
              <DialogDescription>
                <strong>Sanskrit:</strong> {modalData?.sanskrit_name} ({modalData?.sanskrit_name_adapted})<br />
                <strong>Translation:</strong> {modalData?.translation_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={modalData?.url_png}
                alt={modalData?.english_name}
                className="w-full h-48 object-contain"
              />
              <div>
                <h4 className="font-semibold mb-2">Description:</h4>
                <p className="text-sm text-muted-foreground">{modalData?.pose_description}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Benefits:</h4>
                <p className="text-sm text-muted-foreground">{modalData?.pose_benefits}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
