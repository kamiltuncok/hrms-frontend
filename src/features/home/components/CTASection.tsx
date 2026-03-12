import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CallToActionSection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      
      <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals finding new opportunities and employers securing top talent every single day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-white text-primary hover:bg-white/90">
                Create an Account
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-transparent border-white text-white hover:bg-white/10 hover:text-white">
                Post a Job <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
