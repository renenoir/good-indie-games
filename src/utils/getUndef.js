export default function getUndef(func) {
  try {
    return func();
  } catch (error) {}
}
