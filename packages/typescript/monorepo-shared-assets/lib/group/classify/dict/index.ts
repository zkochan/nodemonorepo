import * as types from '../../../.types'

export namespace classify {
  export function singleDistribute<X> (
    values: Iterable<X>,
    classifier: singleDistribute.Classifier<X>
  ): singleDistribute.Classification<X> {
    const db: types.Dict.StrKey<Set<X>> = {}

    for (const item of values) {
      const name = classifier(item)

      if (name in db) {
        db[name].add(item)
      } else {
        db[name] = new Set([item])
      }
    }

    return db
  }

  export namespace singleDistribute {
    export type Classification<X> = Readonly<Dict<Classification.Set<X>>>

    export namespace Classification {
      export type Set<X> = ReadonlySet<X>
    }

    export type Classifier<X> = (x: X) => string
  }

  export function multiDistribute<X> (
    values: Iterable<X>,
    classifier: multiDistribute.Classifier<X>
  ): multiDistribute.MultipleDistribution<X> {
    const classified: types.Dict.StrKey<X[]> = {}
    const unclassified: X[] = []

    for (const item of values) {
      const classes = classifier(item)

      if (classes.length) {
        for (const name of classes) {
          if (name in classified) {
            classified[name].push(item)
          } else {
            classified[name] = [item]
          }
        }
      } else {
        unclassified.push(item)
      }
    }

    return {classified, unclassified}
  }

  export namespace multiDistribute {
    export interface MultipleDistribution<X> {
      readonly classified: MultipleDistribution.Classified<X>
      readonly unclassified: MultipleDistribution.Unclassified<X>
    }

    export namespace MultipleDistribution {
      export type Classified<X> = Readonly<Dict<Distribution<X>>>
      export type Unclassified<X> = ReadonlyArray<X>
      export type Distribution<X> = ReadonlyArray<X>
    }

    export type Classifier<X> = (x: X) => ReadonlyArray<string>
  }

  export type Dict<X> = Readonly<types.Dict.StrKey<X>>
}

export default classify