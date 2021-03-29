import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { Element } from "../Element";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Column({ columnTitle, columnSubtitle, items, hasProgress }) {
  return (
    <StyledContainer>
      <Element variant="header" title={columnTitle} subtitle={columnSubtitle} hasProgress={hasProgress} />
      {items.map((item) => {
        return (
          <Element
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            variant={item.variant}
          />
        );
      })}
    </StyledContainer>
  );
}

Column.propTypes = {
  columnTitle: PropTypes.string,
  columnSubtitle: PropTypes.string,
  hasProgress: PropTypes.bool, 
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      subtitle: PropTypes.string,
      variant: PropTypes.string,
    })
  ),
};

Column.defaultProps = {
  items: [],
};
