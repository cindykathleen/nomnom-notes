export default async function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="form-layout space-y-4 text-center">
      <h2 className="text-2xl font-semibold xl:text-3xl">Invitation not found</h2>
      <p className="text-lg xl:text-xl">{message}. Please check again with the list owner.</p>
    </div>
  );
}