export const scrollToSection = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  callback?: () => void
) => {
  e.preventDefault();
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
  if (callback) {
    callback();
  }
};
