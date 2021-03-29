import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { Column } from "../Column";
import { GridContext } from "../GridContext";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const StyledColumn = styled.div`
  margin-left: 5px;
  margin-right: 5px;
`;

export default function Grid({ columns }) {
  const context = React.useContext(GridContext);
  const [state, dispatch] = context || [{ columns: [] }, () => {}];
  
  return (
    <StyledContainer>
      {state.columns.length === 0 ? <div>No results</div> : <></>}
      {state.columns.map((column) => {
        return (
          <StyledColumn key={column.id}>
            <Column {...column} />
          </StyledColumn>
        );
      })}
    </StyledContainer>
  );
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
