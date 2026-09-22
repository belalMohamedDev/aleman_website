import { motion } from 'framer-motion';

type CareersTalentPoolProps = {
  onOpenGeneralApply?: () => void;
};

export function CareersTalentPool({ onOpenGeneralApply: _onOpen }: CareersTalentPoolProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#02180d] via-[#09351d] to-[#14532d] p-8 md:p-12 text-white shadow-lift"
        >
        </motion.div>
      </div>
    </section>
  );
}
