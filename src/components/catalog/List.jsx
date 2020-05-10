import React from "react";
import styled, { css } from "styled-components";
import Rating from "../common/Rating";
import { format } from "date-fns";

function List({ games }) {
  return (
    <Wrapper>
      {games.map(
        ({
          id,
          cover,
          name,
          rating,
          first_release_date,
          themes,
          platforms,
        }) => (
          <Item key={id}>
            <ImageSize>
              <Image src={cover.replace(/t_thumb/g, "t_cover_big")} />
            </ImageSize>
            <Content>
              <Top>
                <Rating value={rating} />
                <DateText>{format(new Date(first_release_date), "y")}</DateText>
              </Top>
              <Title>{name}</Title>
              <Platforms>
                {platforms.map(({ name }) => name).join(", ")}
              </Platforms>
              <Themes>{themes.map(({ name }) => name).join(", ")}</Themes>
            </Content>
          </Item>
        )
      )}
    </Wrapper>
  );
}

const Wrapper = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: calc(100% + 20px);
  padding: 0;
  margin: 20px -10px;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  margin: 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ImageSize = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 150px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: inherit;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  overflow: hidden;

  &:after {
    display: block;
    padding-bottom: 133%;
    content: "";
  }
`;

const Image = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 20px;
  flex: 1;
`;

const Title = styled.h3`
  margin: 0.5em 0;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const smallText = css`
  font-size: 0.875rem;
`;

const DateText = styled.p`
  ${smallText};
  color: rgba(0, 0, 0, 0.33);
  font-weight: bold;
  margin: 0;
`;

const Platforms = styled.p`
  ${smallText};
  color: rgba(0, 0, 0, 0.5);
`;

const Themes = styled.p`
  ${smallText};
  color: rgba(0, 0, 0, 0.5);
`;

export default List;
