interface Props {
  children: React.ReactNode;
}

export default function ActionsComponent({ children }: Props) {
  return (
    <div className="flex ">
      <div className="flex justify-center items-center mt-2 gap-2">
        {children}
      </div>
    </div>
  );
}
