import { FabricJSEditor } from 'fabricjs-react';

export default function TextPanel({
  editor,
}: {
  editor: FabricJSEditor | null | undefined;
}) {
  return (
    <div>
      <p>Text</p>
    </div>
  );
}
