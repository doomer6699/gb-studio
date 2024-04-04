import React, { FC, useEffect, useState } from "react";
import { useAppSelector } from "store/hooks";
import { tilesetSelectors } from "store/features/entities/entitiesState";
import { Tileset } from "shared/lib/entities/entitiesTypes";
import {
  Option,
  Select,
  OptionLabelWithPreview,
  SingleValueWithPreview,
  SelectCommonProps,
} from "ui/form/Select";
import { TileCanvas } from "components/world/TileCanvas";

interface TilesetSelectProps extends SelectCommonProps {
  name: string;
  value?: string;
  tileIndex?: number;
  onChange?: (newId: string) => void;
  optional?: boolean;
  optionalLabel?: string;
  optionalDefaultTilesetId?: string;
}

interface TilesetOption extends Option {
  tileset: Tileset;
}

export const TilesetSelect: FC<TilesetSelectProps> = ({
  value,
  tileIndex,
  onChange,
  optional,
  optionalLabel,
  optionalDefaultTilesetId,
  ...selectProps
}) => {
  const tilesets = useAppSelector((state) => tilesetSelectors.selectAll(state));
  const [options, setOptions] = useState<TilesetOption[]>([]);
  const [currentTileset, setCurrentTileset] = useState<Tileset>();
  const [currentValue, setCurrentValue] = useState<TilesetOption>();

  useEffect(() => {
    setOptions(
      ([] as TilesetOption[]).concat(
        optional
          ? ([
              {
                value: "",
                label: optionalLabel || "None",
                tileset: tilesets.find(
                  (p) => p.id === optionalDefaultTilesetId
                ),
              },
            ] as TilesetOption[])
          : ([] as TilesetOption[]),
        tilesets.map((tileset) => ({
          value: tileset.id,
          label: tileset.name,
          tileset,
        }))
      )
    );
  }, [tilesets, optional, optionalDefaultTilesetId, optionalLabel]);

  useEffect(() => {
    setCurrentTileset(tilesets.find((v) => v.id === value));
  }, [tilesets, value]);

  useEffect(() => {
    if (currentTileset) {
      setCurrentValue({
        value: currentTileset.id,
        label: `${currentTileset.name}`,
        tileset: currentTileset,
      });
    } else if (optional) {
      const optionalTileset = tilesets.find(
        (p) => p.id === optionalDefaultTilesetId
      );
      setCurrentValue({
        value: "",
        label: optionalLabel || "None",
        tileset: optionalTileset as Tileset,
      });
    } else {
      const firstTileset = tilesets[0];
      if (firstTileset) {
        setCurrentValue({
          value: firstTileset.id,
          label: `${firstTileset.name}`,
          tileset: firstTileset,
        });
      }
    }
  }, [
    currentTileset,
    tilesets,
    optional,
    optionalDefaultTilesetId,
    optionalLabel,
  ]);

  const onSelectChange = (newValue: Option) => {
    onChange?.(newValue.value);
  };

  return (
    <Select
      value={currentValue}
      options={options}
      onChange={onSelectChange}
      formatOptionLabel={(option: TilesetOption) => {
        return (
          <OptionLabelWithPreview
            preview={
              <TileCanvas tilesetId={option.value} tileIndex={tileIndex} />
            }
          >
            {option.label}
          </OptionLabelWithPreview>
        );
      }}
      components={{
        SingleValue: () => (
          <SingleValueWithPreview
            preview={
              <TileCanvas tilesetId={value || ""} tileIndex={tileIndex} />
            }
          >
            {currentValue?.label}
          </SingleValueWithPreview>
        ),
      }}
      {...selectProps}
    />
  );
};