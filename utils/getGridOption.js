export default function getGridOption(number) {
  if (number >= 0 && number <= 640) return "1";
  else if (number >= 641 && number <= 765) return "2";
  else if (number >= 766 && number <= 1024) return "3";
  else if (number >= 1025) return "3";
  return "4";
}

