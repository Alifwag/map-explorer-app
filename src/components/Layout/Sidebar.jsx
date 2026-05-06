import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ children, isOpen = true }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="sidebar"
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="sidebar-content">
            {children}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;