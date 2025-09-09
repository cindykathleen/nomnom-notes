export default async function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="h-fit max-w-3xl px-12 py-10 space-y-4 text-center bg-snowwhite rounded-3xl">
      <h2 className="text-3xl font-semibold">Invitation not found</h2>
      <p className="text-xl">{message}. Please check again with the list owner.</p>
    </div>
  );
}