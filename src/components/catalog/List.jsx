import React from "react";
import Loader from "../common/Loader";
import styled from "styled-components";
import { PRIMARY } from "../../styles/constants";

function List({ games, loading }) {
  if (loading) {
    return <CustomLoader />;
  }

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
              <Rating>
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle
                    cx="20"
                    cy="20"
                    r="17"
                    fill="none"
                    stroke={PRIMARY}
                    strokeWidth="3"
                  />
                </svg>
              </Rating>
              <p>{rating}</p>
              <p>{first_release_date}</p>
              <p>{platforms.map(({ name }) => name).join(", ")}</p>
              <p>{themes.map(({ name }) => name).join(", ")}</p>
              <Title>{name}</Title>
            </Content>
          </Item>
        )
      )}
    </Wrapper>
  );
}

const CustomLoader = styled(Loader)`
  flex-grow: 1;
`;

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
`;

const Title = styled.h3`
  margin-top: 0;
`;

const Rating = styled.div``;

export default List;
