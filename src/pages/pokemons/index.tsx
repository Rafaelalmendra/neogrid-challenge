import { useEffect, useState } from "react";
import type { NextPage } from "next";
import useMedia from "use-media";

//hooks
import { useAxiosFetch } from "hooks/useAxiosFetch";

//design-system
import { Input, Modal } from "antd";

//components
import { HeadSeo } from "components/HeadSeo";
import { Loading } from "components/Loading";
import { NoResults } from "components/NoResults";
import { TotalCards } from "components/TotalCards";
import { LayoutPage } from "components/LayoutPage";
import { CardPokemon } from "components/CardPokemon";
import { FilterButton } from "components/FilterButton";
import { CarouselCards } from "components/CarouselCards";

//styles
import styles from "styles/pages/pokemons.module.less";
import { CardDetailsModal } from "@/components/CardDetailsModal";

const PokemonsPage: NextPage = () => {
  const { Search } = Input;
  const isMobile = useMedia({ maxWidth: "768px" });
  const { pokemonData, typesData, loadingTypes, loadingPokemons } =
    useAxiosFetch();

  const [pokemons, setPokemons] = useState<any[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<any[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [filterByName, setFilterByName] = useState<string>("");
  const [filterByType, setFilterByType] = useState<string>("all");
  const [showModalDetails, setShowModalDetails] = useState<boolean>(false);

  useEffect(() => {
    setFilters(typesData);
    setPokemons(pokemonData);
  }, [typesData, pokemonData]);

  useEffect(() => {
    const lowerSearchByName = filterByName.toLowerCase();

    const handleFilters = () => {
      if (filterByType === "all" || filterByName === "") {
        const filterOnlyByName = pokemons?.filter((card: any) =>
          card.name.toLowerCase().includes(lowerSearchByName)
        );
        setFilteredPokemons(filterOnlyByName);
      }

      if (!filterByName && filterByType !== "all") {
        const filterOnlyByType = pokemons?.filter(
          (card: any) => card.types[0] === filterByType
        );
        setFilteredPokemons(filterOnlyByType);
      }

      if (filterByName && filterByType !== "all") {
        const filterByNameAndType = filteredPokemons?.filter(
          (card) =>
            card.name.toLowerCase().includes(lowerSearchByName) &&
            card.types[0] === filterByType
        );
        setFilteredPokemons(filterByNameAndType);
      }

      if (!filterByName && filterByType === "all") {
        setFilteredPokemons(pokemons);
      }
    };

    handleFilters();
  }, [filterByType, filterByName, pokemons, filteredPokemons]);

  const handleFilterByType = (type: string) => {
    setFilterByName("");
    setFilterByType(type);
  };

  const handleShowModalDetails = () => {
    setShowModalDetails(true);
  };

  return (
    <>
      <HeadSeo
        title="Descubra Pokemons | Pokemon Universe"
        content="Aqui você pode descobrir todos os tipos de Pokémon"
      />

      <LayoutPage>
        <main className={styles.container}>
          <h2>Escolha seu tipo de Pokémon</h2>

          <div className={styles.filters}>
            {loadingTypes ? (
              <p>Buscando tipos...</p>
            ) : (
              <div className={styles.typesContainer}>
                <FilterButton
                  active={filterByType === "all"}
                  onClick={() => handleFilterByType("all")}
                >
                  Todos
                </FilterButton>

                {filters?.map((filter, index: number) => (
                  <FilterButton
                    key={index}
                    active={filterByType === filter}
                    onClick={() => handleFilterByType(filter)}
                  >
                    {filter}
                  </FilterButton>
                ))}
              </div>
            )}

            <Search
              value={filterByName}
              placeholder="Procure um Pokémon..."
              style={{ width: isMobile ? "100%" : 258 }}
              onChange={(e) => setFilterByName(e?.target?.value)}
            />
          </div>

          {loadingPokemons && <Loading />}
          {filteredPokemons?.length === 0 && <NoResults />}

          {isMobile ? (
            <CarouselCards>
              {!filteredPokemons
                ? pokemons?.map((pokemon) => (
                    <CardPokemon
                      key={pokemon?.id}
                      imageLink={pokemon?.images?.large}
                      onClick={() => setShowModalDetails(true)}
                    />
                  ))
                : filteredPokemons
                    ?.slice(0, 40)
                    ?.map((pokemon) => (
                      <CardPokemon
                        key={pokemon?.id}
                        imageLink={pokemon?.images?.large}
                        onClick={() => setShowModalDetails(true)}
                      />
                    ))}
            </CarouselCards>
          ) : (
            <div className={styles.cardsContainer}>
              {!filteredPokemons
                ? pokemons?.map((pokemon) => (
                    <CardPokemon
                      key={pokemon?.id}
                      imageLink={pokemon?.images?.large}
                      onClick={() => setShowModalDetails(true)}
                    />
                  ))
                : filteredPokemons
                    ?.slice(0, 40)
                    ?.map((pokemon) => (
                      <CardPokemon
                        key={pokemon?.id}
                        imageLink={pokemon?.images?.large}
                        onClick={() => setShowModalDetails(true)}
                      />
                    ))}
            </div>
          )}

          {!loadingPokemons && filteredPokemons?.length > 0 && (
            <TotalCards total={filteredPokemons?.slice(0, 40)?.length} />
          )}
        </main>

        <Modal
          title="teste"
          visible={showModalDetails}
          onCancel={() => setShowModalDetails(false)}
        >
          <CardDetailsModal />
        </Modal>
      </LayoutPage>
    </>
  );
};

export default PokemonsPage;
