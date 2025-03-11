export default function InformationCard({ title, content }) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-700 dark:text-gray-300">{content}</p>
      </div>
    );
  }