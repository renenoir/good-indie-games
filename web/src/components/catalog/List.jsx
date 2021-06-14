import React from "react";
import styled, { css } from "styled-components";
import Rating from "../common/Rating";
import { format } from "date-fns";
import { GRAY } from "../../styles/constants";
import useUser from "../../hooks/useUser";
import useLoginOpen from "../../hooks/useLoginOpen";
import { Link } from "react-router-dom";
import slugify from "slugify";

function List({
  games,
  loading,
  favoritesHashmap,
  addFavorite,
  removeFavorite,
}) {
  const { token } = useUser();
  const { setLoginOpen } = useLoginOpen();

  if (!loading && (!games || !games.length)) {
    return <NoGames>No games founded.</NoGames>;
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
        }) => {
          const favorite = favoritesHashmap[id] !== undefined;
          const slug = slugify(name, {
            remove: /[*+~.()'"!:@]/g,
          }).toLowerCase();
          const url = `/${id}/${slug}`;

          return (
            <Item key={id}>
              <CustomLink to={url}>
                <ImageSize>
                  <Image src={cover.replace(/t_thumb/g, "t_cover_big")} />
                </ImageSize>
              </CustomLink>
              <Content>
                <Top>
                  <Rating value={rating} />
                  <DateText>
                    {format(new Date(first_release_date), "y")}
                  </DateText>
                  <ToggleFavorite
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!token) {
                        setLoginOpen(true);
                        return;
                      }

                      if (favorite) {
                        removeFavorite(id);
                      } else {
                        addFavorite(id);
                      }
                    }}
                  >
                    <Star
                      viewBox="0 -10 511.98685 511"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"
                        fill={favorite ? "#ffc107" : GRAY}
                      />
                    </Star>
                  </ToggleFavorite>
                </Top>
                <CustomLink to={url}>
                  <Title>{name}</Title>
                </CustomLink>
                <Platforms>
                  {platforms.map(({ name }) => name).join(", ")}
                </Platforms>
                <Themes>{themes.map(({ name }) => name).join(", ")}</Themes>
              </Content>
            </Item>
          );
        }
      )}
    </Wrapper>
  );
}

const NoGames = styled.h2`
  text-align: center;
`;

const Wrapper = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: calc(100% + 20px);
  padding: 0;
  margin: -10px;
  list-style: none;

  @media (max-width: 60rem) {
    display: block;
  }
`;

const Item = styled.li`
  display: flex;
  margin: 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const CustomLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: none;
  }
`;

const ImageSize = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 150px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
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

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ToggleFavorite = styled.button`
  display: inline-block;
  background: none;
  border: none;
  padding: 0;
  margin: 0.75rem 0 0.5rem auto;
  cursor: pointer;

  &[disabled] {
    color: inherit;
  }
`;

const Title = styled.h3`
  margin: 0;
  padding-top: 0.25rem;
`;

const Star = styled.svg`
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
  path {
    transition: 0.2s ease-in-out;
  }
`;

const smallText = css`
  font-size: 0.875rem;
`;

const DateText = styled.p`
  ${smallText};
  color: rgba(0, 0, 0, 0.33);
  font-weight: bold;
  margin: 0;
  margin-left: 0.5rem;
`;

const Platforms = styled.p`
  ${smallText};
  margin: 0.5rem 0;
  color: rgba(0, 0, 0, 0.5);
`;

const Themes = styled.p`
  ${smallText};
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 0;
`;

export default List;
