import { css } from "styled-components";

export const base = css`
  min-width: 150px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
`;
export const variant = {
  default: css`
    background-color: #dbdbdb;
    color: #333;
  `,
  available: css`
    background-color: #3333aa;
    color: #fff;
  `,
  closed: css`
    background-color: #aa3333;
    color: #fff;
  `,
  scheduled: css`
    background-color: #33aa33;
    color: #fff;
  `,
  header: css`
    background-color: #495261;
    color: #fff;
  `,
};

export const selected = css`
  border: solid 2px #333;
`
