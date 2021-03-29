import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { Column } from "../Column";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const StyledColumn = styled.div`
  margin-left: 5px;
  margin-right: 5px;
`;

export default function Grid({ columns }) {
  return <StyledContainer>
    {columns.map(column => (
      <StyledColumn>
        <Column {...column}/>
      </StyledColumn>
    ))}
  </StyledContainer>;
}

Column.propTypes = {
  columnTitle: PropTypes.string,
  columnSubtitle: PropTypes.string,
  hasProgress: PropTypes.bool,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      hasProgress: PropTypes.bool,
      columnTitle: PropTypes.string,
      columnSubtitle: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          title: PropTypes.string,
          subtitle: PropTypes.string,
          variant: PropTypes.string,
        })
      ),
    })
  ),
};

Column.defaultProps = {
  columns: [],
};
