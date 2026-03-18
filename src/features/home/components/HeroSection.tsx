import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCities } from '@/features/cities/hooks/useCities';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/SearchInput';
import { MapPin } from 'lucide-react';

export function HeroSection() {
  const { data: cities = [], isLoading: isLoadingCities } = useCities();
  const [keyword, setKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleSearch = () => {
    // Phase 6 wiring will pass this to the Jobs list
    console.log("Searching for:", keyword, "in", selectedCity);
  };

  return (
    <section className="relative overflow-hidden bg-muted/30 py-20 lg:py-32">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
        <div className="w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
        <div className="w-72 h-72 bg-secondary/30 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Hayalinizdeki İşi Bugün Bulun
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              En iyi işverenlerle bağlantı kurun ve yeteneklerinize uygun fırsatları keşfedin.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row shadow-lg bg-background rounded-xl p-2 max-w-3xl mx-auto border border-border"
          >
            <div className="flex-1 p-2 border-b md:border-b-0 md:border-r border-border">
              <SearchInput 
                placeholder="İş unvanı, anahtar kelime veya şirket"
                onChange={setKeyword}
                className="w-full border-0 focus-visible:ring-0 shadow-none bg-transparent"
              />
            </div>
            <div className="flex-1 p-2 flex items-center relative">
               <MapPin className="h-4 w-4 text-muted-foreground absolute left-4 z-10" />
               <select 
                 className="w-full h-10 pl-10 pr-4 bg-transparent border-0 focus:outline-none focus:ring-0 text-sm cursor-pointer z-0 appearance-none relative"
                 value={selectedCity}
                 onChange={(e) => setSelectedCity(e.target.value)}
                 disabled={isLoadingCities}
               >
                 <option value="">Tüm Konumlar</option>
                 {cities.map(city => (
                   <option key={city.id} value={city.name}>{city.name}</option>
                 ))}
               </select>
            </div>
            <div className="p-2 w-full md:w-auto">
              <Button onClick={handleSearch} className="w-full h-full min-h-[40px] px-8 rounded-lg">
                Ara
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-6"
          >
            <p className="text-sm font-medium text-muted-foreground mb-4">Popüler Aramalar:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Frontend Developer', 'Data Scientist', 'Product Manager'].map((tag) => (
                 <span key={tag} className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold cursor-pointer hover:bg-secondary/80 transition-colors">
                   {tag}
                 </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
