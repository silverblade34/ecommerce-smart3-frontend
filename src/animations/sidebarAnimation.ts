export const sidebarHoverAnimation = {
  initial: { width: "4rem", opacity: 0.6 },
  animate: { width: "16rem", opacity: 1 },
  exit: { width: "4rem", opacity: 0 },
  transition: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
    opacity: { duration: 0.2 },
  },
};

export const sidebarDefaultAnimation = (sidebar: boolean) => ({
  initial: { width: "4rem" },
  animate: { width: sidebar ? "18rem" : "4rem" },
  transition: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
});
