import { showMessage, MessageType } from "react-native-flash-message";

export const showToast = (
  message: string,
  description: string,
  type: MessageType
) => {
  showMessage({
    message,
    description,
    type,
    position: "top",
    icon: "auto",
    duration: 1000,
  });
};

export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const formattedDate = date
    .toLocaleString("en-US", options)
    .replace(",", " |");

  return formattedDate;
}



export function getTimeAgo(datePost: string | Date): string {
  const currentDate = new Date();
  const postDate = new Date(datePost);

  const seconds = Math.floor((currentDate.getTime() - postDate.getTime()) / 1000);
  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} days ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} months ago`;
  }

  const years = Math.floor(months / 12);
  return `${years} years ago`;
}


export  function formatTime(timestamp:any) {
  const date = new Date(timestamp);
  
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  
  hours = hours % 12 || 12; 
  // Ensure minutes are two digits
  minutes = minutes.toString().padStart(2, '0');

  return `${hours}:${minutes} ${ampm}`;
}



