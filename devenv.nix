{ pkgs, ... }:

{
  packages = with pkgs;
    [ vscode-langservers-extracted
      nodePackages.typescript-language-server
    ];

  languages.javascript = {
    enable = true;
    npm.enable = true;
  };
}
