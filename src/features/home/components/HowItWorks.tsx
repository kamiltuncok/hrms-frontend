import { motion } from 'framer-motion';
import { UserPlus, Search, FileSignature, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Hesap Oluştur',
    description: 'İş arayan veya işveren olarak dakikalar içinde kayıt olun.',
    iconBg: '#EFF6FF',
    iconColor: '#1D6FEB',
    numberBg: '#1D6FEB',
  },
  {
    icon: Search,
    step: '02',
    title: 'İş Ara',
    description: 'Yeteneklerinize uygun pozisyonları filtreler ve arama ile kolayca bulun.',
    iconBg: '#EEF2FF',
    iconColor: '#6366F1',
    numberBg: '#6366F1',
  },
  {
    icon: FileSignature,
    step: '03',
    title: 'Kolayca Başvur',
    description: 'Özgeçmişinizi gönderin ve başvurularınızı gerçek zamanlı takip edin.',
    iconBg: '#F0F9FF',
    iconColor: '#0EA5E9',
    numberBg: '#0EA5E9',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'İşe Gir',
    description: 'İK ekipleriyle bağlantı kurun, mülakata çağrılın ve pozisyonu kapın.',
    iconBg: '#ECFDF5',
    iconColor: '#10B981',
    numberBg: '#10B981',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-28 bg-[#F0F6FF] relative overflow-hidden">
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(hsl(217 83% 52% / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(217 83% 52% / 0.05) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      <div className="container relative z-10 mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-20 space-y-4"
        >
          <p className="text-xs font-extrabold text-primary uppercase tracking-widest">Süreç</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Nasıl Çalışır?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium text-lg">
            4 adımda işe başlayın — ister iş arıyor olun, ister işveren.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Dotted connector line — desktop */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-[56px] left-[13%] right-[13%] z-0"
            style={{
              height: '2px',
              background:
                'repeating-linear-gradient(90deg, hsl(217 83% 52% / 0.30) 0px, hsl(217 83% 52% / 0.30) 10px, transparent 10px, transparent 24px)',
            }}
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-center text-center z-10"
              >
                {/* Icon circle */}
                <div className="relative mb-7">
                  <div
                    className="w-[112px] h-[112px] rounded-3xl flex items-center justify-center shadow-xl"
                    style={{ background: step.iconBg }}
                  >
                    <Icon
                      className="w-12 h-12"
                      strokeWidth={1.5}
                      style={{ color: step.iconColor }}
                    />
                  </div>
                  {/* Step number */}
                  <span
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white shadow-lg"
                    style={{ background: step.numberBg }}
                  >
                    {step.step}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-[190px]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
