

clear; clc; close all;

% Create output folder
out_dir = 'boundary_layer_plots';
if ~exist(out_dir, 'dir')
    mkdir(out_dir);
end

% Constants
x_vals = linspace(0.01, 6, 300);
y_vals = linspace(0, 0.065, 300);
x_locs = linspace(0.5,4.5,10);
T_inf = 300; T_wall = 400; U_inf = 1;

% Fluid properties: Name, Pr, nu, k [SI units]
fluids = {
    'Air', 0.7, 1.5e-5, 0.026;
    'Water', 7.0, 1e-6, 0.6;
    'Liquid Metal', 0.01, 1.5e-7, 30;
    'Engine Oil', 1.0, 2.5e-5, 0.145
};

% Solve Blasius
alpha = fzero(@(a) blasius_shooting(a), [0.3, 0.4]);
[eta, F] = ode45(@blasius_rhs, [0 10], [0 0 alpha]);
fp = F(:,2); f = F(:,1);

for i = 1:size(fluids, 1)  
    name = fluids{i,1};
    Pr = fluids{i,2}; nu = fluids{i,3}; k = fluids{i,4};
    [X, Y] = meshgrid(x_vals, y_vals);
    ETA = Y .* sqrt(U_inf ./ (nu .* X));
    u_grid = interp1(eta, fp, ETA, 'linear', 'extrap');

    % Compute boundary layer thickness
    delta_v = 5 * sqrt(nu .* x_vals / U_inf);
    delta_t = delta_v / sqrt(Pr);
    delta_t_grid = interp1(x_vals, delta_t, X);

    % Temperature profile inside delta_t
    theta = (1 - Y ./ delta_t_grid).^2;
    theta(Y > delta_t_grid) = 0;
    T_grid = T_inf + theta .* (T_wall - T_inf);

    % --- Plot 1: Contours + Parabola ---
    for idx = 1:length(x_locs)
        x0 = x_locs(idx);
        delta_tx = 5 * sqrt(nu * x0 / U_inf) / sqrt(Pr);
        y_prof = linspace(0, delta_tx, 100);
        theta_prof = (1 - y_prof / delta_tx).^2;
        T_prof = T_inf + theta_prof * (T_wall - T_inf);

        fig1 = figure('Visible','off');
        contourf(X, Y, T_grid, 40, 'LineColor', 'none');
        colormap("cool"); colorbar;
        hold on;
        
        h_v = plot(x_vals, delta_v, '--k', 'LineWidth', 1.3);   % Velocity BL (dashed)
        h_t = plot(x_vals, delta_t, '-r', 'LineWidth', 1.5);    % Thermal BL (solid)
        plot(x0 + (T_prof - T_inf)*0.008, y_prof, 'b-', 'LineWidth', 2);


        arrow_y_start = 0.05 * delta_tx;
        arrow_y_end = delta_tx;
        n_arrows = max(4, round(delta_tx / 0.002));
        y_arrows = linspace(arrow_y_start, arrow_y_end, n_arrows);
        x_scale = 0.008;

        for j = 1:length(y_arrows)
            yy = y_arrows(j);
            theta_y = (1 - yy / delta_tx)^2;
            Ty = T_inf + theta_y * (T_wall - T_inf);
            x_tip = x0 + (Ty - T_inf) * x_scale;
            u_arrow = x_tip - x0;
            quiver(x0, yy, u_arrow, 0, 'Color', 'k', 'LineWidth', 1.2, ...
                   'MaxHeadSize', 0.015, 'AutoScale', 'off');
        end
        legend([h_v, h_t], {'Velocity BL', 'Thermal BL'}, ...
       'Location', 'northwest', 'FontSize', 10, 'Box', 'off');
        title(sprintf('%s Temperature Profile at x = %.1f m', name, x0));
        xlabel('x (m)'); ylabel('y (m)');
        % legend({'Velocity BL (δ_v)', 'Thermal BL (δ_t)', 'Parabolic T-profile'}, ...
        %        'Location', 'northeast', 'FontSize', 10);
        grid on; set(gca, 'FontSize', 13);

        % Save figure
        fname = fullfile(out_dir, sprintf('%s_x%.1f.png', strrep(name,' ','_'), x0));
        exportgraphics(fig1, fname, 'Resolution', 300);
        close(fig1);
    end

    % --- Plot 2: h(x) ---
    delta_t_vals = 5 * sqrt(nu .* x_vals / U_inf) / sqrt(Pr);
    dTdy_wall = -(2 ./ delta_t_vals) * (T_wall - T_inf);
    h_vals = -k * dTdy_wall;

    fig2 = figure('Visible','off');
    plot(x_vals, h_vals, 'm-', 'LineWidth', 2);
    % ylim([0 3500]);  % Set consistent y-axis
    xlabel('x (m)'); ylabel('h(x) [W/m^2·K]');
    title(sprintf('%s: Local Heat Transfer Coefficient h(x)', name));
    grid on; set(gca, 'FontSize', 13);

    fname2 = fullfile(out_dir, sprintf('%s_hx.png', strrep(name,' ','_')));
    exportgraphics(fig2, fname2, 'Resolution', 300);
    close(fig2);
end

% --- Blasius functions ---
function dF = blasius_rhs(~, F)
    dF = zeros(3,1);
    dF(1) = F(2); dF(2) = F(3);
    dF(3) = -0.5 * F(1) * F(3);
end

function mismatch = blasius_shooting(alpha)
    [~, F] = ode45(@blasius_rhs, [0 10], [0 0 alpha]);
    mismatch = F(end,2) - 1;
end
