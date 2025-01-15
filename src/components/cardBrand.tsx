import { useState, useEffect } from "preact/hooks";

interface CardBrandProps {
  cardNumber: string;
  expiredDate: string;
  names: string;
  lastnames: string;
}
export const CardBrand = ({
  cardNumber,
  expiredDate,
  names,
  lastnames,
}: CardBrandProps) => {
  const [cardLayer, setCardLayer] = useState<string>("XXXX XXXX XXXX XXXX");
  const [expiredDateLayer, setExpiredDateLayer] = useState<string>("MM/YY");
  const [namesLayer, setNamesLayer] = useState<string>(names);
  const [lastnamesLayer, setLastnamesLayer] = useState<string>(lastnames);

  const onUpdateNamesLayer = (n: string) => {
    let updateNamesLayer = n;
    if (n.length > 12) {
      updateNamesLayer = n.slice(0, 12);
    }
    setNamesLayer(updateNamesLayer);
  };
  const onUpdateLastnamesLayer = (ln: string) => {
    let updateLastnamesLayer = ln;
    if (ln.length > 12) {
      updateLastnamesLayer = ln.slice(0, 12);
    }
    setLastnamesLayer(updateLastnamesLayer);
  };

  const onUpdateCardLayer = (cN: string) => {
    const firstx = cN.slice(0, 4);
    const secondx = cN.slice(-4);
    let updateCardLayer = "XXXX XXXX XXXX XXXX";
    if (cN.length > 0) {
      updateCardLayer = updateCardLayer.replace(/^X{4}/, firstx);
      if (cN.length >= 12) {
        updateCardLayer = updateCardLayer.replace(/X{4}$/, secondx);
      }
    }
    setCardLayer(updateCardLayer);
  };
  const onUpdateDateLayer = (eD: string) => {
    const firstx = eD.slice(0, 2);
    const secondx = eD.slice(-2);
    let updateDateLayer = "MM/YY";
    if (eD.length > 0) {
      updateDateLayer = updateDateLayer.replace(/^MM/, firstx);
      if (eD.length > 2) {
        updateDateLayer = updateDateLayer.replace(/YY$/, secondx);
      }
    }
    setExpiredDateLayer(updateDateLayer);
  };

  useEffect(() => {
    onUpdateCardLayer(cardNumber);
  }, [cardNumber]);
  useEffect(() => {
    onUpdateDateLayer(expiredDate);
  }, [expiredDate]);
  useEffect(() => {
    console.log("names", names);
    onUpdateNamesLayer(names);
  }, [names]);
  useEffect(() => {
    onUpdateLastnamesLayer(lastnames);
  }, [lastnames]);

  return (
    <div className="ppxiss-card-brand-container container">
      <div className="ppxiss-card-brand-content">
        <div className="row my-2">
          <div className="col d-flex justify-content-center ppxiss-card-brand-font-large">
            {cardLayer}
          </div>
        </div>
      </div>
      <div class={"row mt-auto "}>
        <div
          class={
            "col d-flex justify-content-start ppxiss-card-brand-font-medium"
          }
        >
          {namesLayer.length + lastnamesLayer.length + 1 > 12
            ? namesLayer.slice(0, 1) +
              ". " +
              lastnamesLayer.slice(0, 11 - names.length)
            : namesLayer + " " + lastnamesLayer}
        </div>
        <div
          class={"col d-flex justify-content-end ppxiss-card-brand-font-small"}
        >
          {expiredDateLayer}
        </div>
      </div>
    </div>
  );
};
