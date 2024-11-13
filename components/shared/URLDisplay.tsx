import { useMemo } from 'react';

interface URLDisplayProps {
  url: string;
}

const URLDisplay: React.FC<URLDisplayProps> = ({ url }) => {
  const truncatedUrl = useMemo(() => {
    try {
      const urlObject = new URL(url);
      const pathStart = urlObject.pathname.length > 20 ? `${urlObject.pathname.slice(0, 20)}...` : urlObject.pathname;
      return `${urlObject.origin}${pathStart}`;
    } catch (error) {
      return url; // Fallback in case of an invalid URL
    }
  }, [url]);

  return (
    <div className="w-full mt-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-gray-800 text-white rounded-full overflow-hidden text-ellipsis max-w-fit hover:bg-gray-700 transition-colors whitespace-nowrap"
        title={url}
      >
        {truncatedUrl}
      </a>
    </div>
  );
};

export default URLDisplay;
