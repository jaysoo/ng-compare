## Comparison without cache

Webpack:

```shell
cd ng-webpack
hyperfine --prepare "rm -rf .angular/cache" "ng build"
```

Rspack:

```shell
cd ng-rspack
hyperfine "nx build --skip-nx-cache"
```

### Results

On my machine (MacOS - Apple Silicon)


Webpack:

```
Benchmark 1: ng build
  Time (mean ± σ):     10.570 s ±  0.543 s    [User: 16.967 s, System: 2.476 s]
  Range (min … max):   10.367 s … 12.114 s    10 runs
```

Rspack: 

```
Benchmark 1: nx build --skip-nx-cache
  Time (mean ± σ):      4.977 s ±  2.626 s    [User: 10.182 s, System: 0.886 s]
  Range (min … max):    4.116 s … 12.451 s    10 runs
```

## Comparison with cache

TODO: Enable cache in Rspack and see if it works or not.
