import { proxy } from "valtio";

export const state = proxy<{
  editorState: {
    json: any;
    bgColor: string;
  }[];
  activeIndex: number;
}>({
  editorState: [
    {
      json: null,
      bgColor: '#ffffff',
    },
  ],
  activeIndex: 0,
});
