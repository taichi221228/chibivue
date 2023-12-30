import { createRenderer } from "../runtime-core";
import { nodeOps } from "./nodeOps";

export const { render } = createRenderer(nodeOps);
